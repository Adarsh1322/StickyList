import React from 'react';
import { View, Text, SafeAreaView, SectionList } from 'react-native';
import { styles } from './styles';
import { contacts } from '../Components/apiData';

const prepareData = (contacts) => {
  const groupedContacts = contacts.reduce((acc, contact) => {
    const letter = contact.key;

    if (!acc[letter]) {
      acc[letter] = [];
    }

    acc[letter].push(contact);
    return acc;
  }, {});
  Object.keys(groupedContacts).forEach((key) => {
    groupedContacts[key] = groupedContacts[key].sort((a, b) => a.name.localeCompare(b.name));
  });

  return Object.keys(groupedContacts).sort().map((key) => ({
      title: key,
      data: Object.values(
        groupedContacts[key].reduce((acc, contact) => {
          const subKey = contact.name.charAt(0);
          if (!acc[subKey]) {
            acc[subKey] = [];
          }
          acc[subKey].push(contact);
          return acc;
        }, {})
      ).map((subGroup) => ({
        title: subGroup[0].name.charAt(0), 
        data: subGroup,
      })),
    }));
};

const Home = () => {
  const sections = prepareData(contacts);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.name}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.mainHeaderContainer}>
            <Text style={styles.mainHeaderText}>{title}</Text>
          </View>
        )}
        renderSectionFooter={({ section: { data } }) =>
          data.map((subSection) => (
            <View key={subSection.title} style={styles.subHeaderContainer}>
              <Text style={styles.subHeaderText}>{subSection.title}</Text>
              {subSection.data.map((contact) => (
                <View key={contact.name} style={styles.itemContainer}>
                  <Text style={styles.item}>{contact.name}</Text>
                </View>
              ))}
            </View>
          ))
        }
        stickySectionHeadersEnabled={true} 
      />
    </SafeAreaView>
  );
};

export default Home;